define({ "api": [
  {
    "type": "get",
    "url": "/:query",
    "title": "Return something",
    "name": "Query",
    "group": "Example",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query",
            "description": "<p>Query string.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "someVar",
            "description": "<p>Some string.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Something appends !</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/simon/Documents/_WORKS/nodejs-boilerplate/bundles/example/exampleRouter.js",
    "groupTitle": "Example",
    "sampleRequest": [
      {
        "url": "https://api.example.com/:query"
      }
    ]
  }
] });
