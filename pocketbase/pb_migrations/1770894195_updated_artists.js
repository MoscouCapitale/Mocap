/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4185980916")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_50jIkG7ZF2` ON `artists` (\n  `user`,\n  `name`\n)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation2375276105",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4185980916")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_50jIkG7ZF2` ON `artists` (`name`)"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("relation2375276105")

  return app.save(collection)
})
