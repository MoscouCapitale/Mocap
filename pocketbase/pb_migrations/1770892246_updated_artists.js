/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4185980916")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_50jIkG7ZF2` ON `artists` (`name`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4185980916")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
