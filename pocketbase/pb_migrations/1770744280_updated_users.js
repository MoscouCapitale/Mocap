/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "oauth2": {
      "mappedFields": {
        "avatarURL": "",
        "name": ""
      }
    }
  }, collection)

  // remove field
  collection.fields.removeById("text1579384326")

  // remove field
  collection.fields.removeById("file376926767")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "superadmin",
      "admin",
      "user"
    ]
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "RQST",
      "ACTV",
      "DECL",
      "BLCK",
      "BANN"
    ]
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json3912345333",
    "maxSize": 0,
    "name": "preferences",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "oauth2": {
      "mappedFields": {
        "avatarURL": "avatar",
        "name": "name"
      }
    }
  }, collection)

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1579384326",
    "max": 255,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "file376926767",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp"
    ],
    "name": "avatar",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  // remove field
  collection.fields.removeById("select1466534506")

  // remove field
  collection.fields.removeById("select2063623452")

  // remove field
  collection.fields.removeById("json3912345333")

  return app.save(collection)
})
