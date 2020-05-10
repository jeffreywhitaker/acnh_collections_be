const path = require('path')
const { Seeder } = require('mongo-seeding')

const seeder = new Seeder({
  database: {
    name: 'testing',
  },
  dropDatabase: true,
})

const collections = seeder.readCollectionsFromPath(
  path.resolve('./data.json'),
  {
    transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
  },
)

seeder
  .import(collections)
  .then(() => {
    console.log('Success')
  })
  .catch((err) => {
    console.log('Error', err)
  })
