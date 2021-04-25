import { ref, watch } from "vue";

const flatDirectories = ref([
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
    children: [],
  },
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
    children: [],
  },
  {
    id: "111",
    name: "Dir SubSub 1",
    description: "Desc 5",
    parent: "12",
    children: [],
  },
  {
    id: "2",
    name: "Dir 2",
    description: "Desc 2",
    parent: null,
    children: [],
  },
]);
const directoryTree = ref([]);
const directoryMenuItems = ref([]);

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

const builtDirectoryTree = (parentId, childrenArray) => {
  const children = flatDirectories.value.filter((d) => d.parent === parentId);

  // add children
  childrenArray.length = 0;
  childrenArray.push(...children);

  // add children recursively
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    builtDirectoryTree(child.id, child.children);
  }
};

export default function () {
  // initial struture generation
  directoryTree.value.length = 0;
  builtDirectoryTree(null, directoryTree.value);
  directoryMenuItems.value = directoryTree.value.map((d) => toMenuItem(d));

  watch(flatDirectories, () => {
    const tmp = [];
    builtDirectoryTree(null, tmp);
    directoryTree.value = tmp;

    // recalculate menu items
    directoryMenuItems.value = directoryTree.value.map((d) => toMenuItem(d));
  });

  return {
    directories: flatDirectories,
    directoryMenuItems,
    deleteDirectory: function (directoryId) {
      flatDirectories.value = flatDirectories.value.filter(
        (d) => d.id !== directoryId
      );

      // trigger reactivity
      // eslint-disable-next-line no-self-assign
      flatDirectories.value = flatDirectories.value;
    },
  };
}
