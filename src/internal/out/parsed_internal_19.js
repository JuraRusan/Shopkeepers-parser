const internal = {
  name: "",
  value: {
    "block-entity-components": {
      type: "compound",
      value: {
        "minecraft:container": {
          type: "list",
          value: {
            type: "compound",
            value: [
              {
                slot: {
                  type: "int",
                  value: 0,
                },
                item: {
                  type: "compound",
                  value: {
                    id: {
                      type: "string",
                      value: "minecraft:written_book",
                    },
                    count: {
                      type: "int",
                      value: 1,
                    },
                    components: {
                      type: "compound",
                      value: {
                        "minecraft:written_book_content": {
                          type: "compound",
                          value: {
                            pages: {
                              type: "list",
                              value: {
                                type: "compound",
                                value: [
                                  {
                                    raw: {
                                      type: "string",
                                      value: '"asd\\nasd\\n\\n\\nasd\\n\\nggfd"',
                                    },
                                  },
                                ],
                              },
                            },
                            title: {
                              type: "compound",
                              value: {
                                raw: {
                                  type: "string",
                                  value: "Book Title",
                                },
                              },
                            },
                            author: {
                              type: "string",
                              value: "Book Author",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
};
