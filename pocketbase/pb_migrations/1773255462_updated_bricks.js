/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_54894089")

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1940545659",
    "hidden": false,
    "id": "relation917281265",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "link",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3287366145",
    "hidden": false,
    "id": "relation966291011",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "album",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text999008199",
    "max": 0,
    "min": 0,
    "name": "text",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "select160452849",
    "maxSelect": 1,
    "name": "highlight_variant",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "default",
      "hero"
    ]
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "select2036416849",
    "maxSelect": 1,
    "name": "highlight_style",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "scrolling-hero"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_54894089")

  // remove field
  collection.fields.removeById("relation917281265")

  // remove field
  collection.fields.removeById("relation966291011")

  // remove field
  collection.fields.removeById("text999008199")

  // remove field
  collection.fields.removeById("select160452849")

  // remove field
  collection.fields.removeById("select2036416849")

  return app.save(collection)
})
