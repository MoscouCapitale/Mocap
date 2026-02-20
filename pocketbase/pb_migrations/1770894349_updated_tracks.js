/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_327047008")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_STVeAqFzMK` ON `tracks` (\n  `user`,\n  `name`\n)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation2375276105",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_327047008")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_STVeAqFzMK` ON `tracks` (`name`)"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("relation2375276105")

  return app.save(collection)
})
