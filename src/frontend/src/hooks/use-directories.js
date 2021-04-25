import { reactive } from "vue";

const directories = reactive([
  {
    id: "0",
    name: "Uncategorized",
    description: "Desc 2",
    parent: null,
    children: [],
  },
  {
    id: "1",
    name: "Dir 1",
    description: "Desc 1",
    parent: null,
    children: [
      {
        id: "11",
        name: "Dir Sub 1",
        description: "Desc 3",
        parent: "1",
        children: [],
      },
      {
        id: "12",
        name: "Dir Sub 2",
        description: "Desc 4",
        parent: "1",
        children: [
          {
            id: "111",
            name: "Dir SubSub 1",
            description: "Desc 5",
            parent: "12",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Dir 2",
    description: "Desc 2",
    parent: null,
    children: [],
  },
]);

const toMenuItem = (dir) => {
  const children = [];
  for (let i = 0; i < dir.children.length; i++) {
    children.push(toMenuItem(dir.children[i]));
  }

  return {
    key: dir.id,
    label: dir.name,
    // icon: "fas fa-folder",
    children: children,
  };
};

export default function () {
  return {
    directories,
    getTreeItems: function () {
      return directories.map((d) => toMenuItem(d));
    },
  };
}
