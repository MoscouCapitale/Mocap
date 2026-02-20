/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_54894089")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_20n5x9W3CQ` ON `bricks` (\n  `user`,\n  `type`,\n  `title`\n)",
      "CREATE INDEX `idx_qJUfAGsTha` ON `bricks` (\n  `user`,\n  `media`,\n  `type`,\n  `title`\n)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(6, new Field({
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
  const collection = app.findCollectionByNameOrId("pbc_54894089")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_20n5x9W3CQ` ON `bricks` (\n  `type`,\n  `title`\n)",
      "CREATE INDEX `idx_wFYpLl6fGS` ON `bricks` (\n  `title`,\n  `type`\n)",
      "CREATE INDEX `idx_qJUfAGsTha` ON `bricks` (\n  `media`,\n  `type`,\n  `title`\n)"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("relation2375276105")

  return app.save(collection)
})
