const express = require('express')
const getDb = require('../lib/mongo')

const router = express.Router()

const seedOrgs = [
  { name: 'Community Clinic A', slug: 'community-clinic-a' },
  { name: 'General Hospital B', slug: 'general-hospital-b' },
  { name: 'Independent Practice C', slug: 'independent-practice-c' },
]

router.get('/', async (req, res) => {
  try {
    const db = await getDb()
    if (!db) return res.json({ organizations: seedOrgs.map((o, i) => ({ id: `org-${i + 1}`, name: o.name })) })

    const col = db.collection('organizations')
    const count = await col.countDocuments()
    if (count === 0) {
      await col.insertMany(seedOrgs.map(o => ({ name: o.name, slug: o.slug, createdAt: new Date() })))
    }

    const docs = await col.find().toArray()
    const organizations = docs.map(d => ({ id: String(d._id), name: d.name }))
    return res.json({ organizations })
  } catch (err) {
    console.error('organizations GET error', err)
    return res.json({ organizations: seedOrgs.map((o, i) => ({ id: `org-${i + 1}`, name: o.name })) })
  }
})

module.exports = router

// GET /api/organizations/:id/doctors - return doctors for an organization with their patients and diagnoses
router.get('/:id/doctors', async (req, res) => {
  try {
    const db = await getDb()
    if (!db) return res.status(503).json({ doctors: [] })

    const orgId = req.params.id
    const org = await db.collection('organizations').findOne({ _id: new (require('mongodb').ObjectId)(orgId) })
    if (!org) return res.status(404).json({ error: 'organization not found' })

    // auth: require admin
    const auth = req.get('authorization')
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' })
    const token = auth.split(' ')[1]
    let data
    try { data = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'change-this-secret') } catch (err) { return res.status(401).json({ error: 'invalid token' }) }
    const requesterId = data.id || null
    if (!requesterId) return res.status(401).json({ error: 'invalid requester' })
    if (String(org.admin) !== String(requesterId)) return res.status(403).json({ error: 'forbidden' })

    // find doctors (users) associated with this org
    const usersCol = db.collection('users')
    const docs = await usersCol.find({ 'profile.organizationId': String(orgId) }).toArray()
    const doctors = []
    const patientsCol = db.collection('patients')
    for (const d of docs.filter(doc => doc.role === 'doctor')) {
      const docId = String(d._id)
      const docEmail = d.email
      const patients = await patientsCol.find({ $or: [{ createdBy: docId }, { createdBy: docEmail }] }).toArray()
      const patientList = patients.map(p => ({ id: String(p._id), name: p.name, age: p.age, icd11: p.icd11, disease: p.disease, createdAt: p.createdAt }))
      // collect diagnoses authored by this doctor across patients
      const diagnoses = []
      for (const p of patients) {
        if (Array.isArray(p.diagnoses)) {
          for (const diag of p.diagnoses) {
            if (String(diag.createdBy) === docId || String(diag.createdBy) === docEmail) {
              diagnoses.push({ id: diag.id || String(new (require('mongodb').ObjectId)()), patientId: String(p._id), patientName: p.name || '', icd11: diag.icd11 || null, disease: diag.disease || null, notes: diag.notes || null, createdAt: diag.createdAt || null })
            }
          }
        }
      }

      doctors.push({ id: docId, email: docEmail, profile: d.profile || {}, patients: patientList, diagnoses })
    }

    return res.json({ doctors })
  } catch (err) {
    console.error('org doctors error', err)
    return res.status(500).json({ error: 'failed to load doctors' })
  }
})
