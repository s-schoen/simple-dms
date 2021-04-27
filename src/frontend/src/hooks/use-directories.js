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
const selectedDirectory = ref(null);

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

const computeProperties = () => {
  const tmp = [];
  builtDirectoryTree(null, tmp);
  directoryTree.value = tmp;

  // recalculate menu items
  directoryMenuItems.value = directoryTree.value.map((d) => toMenuItem(d));
};

export default function () {
  // initial struture generation
  computeProperties();

  watch(flatDirectories, () => {
    computeProperties();
  });

  return {
    selectedDirectory,
    directories: flatDirectories,
    directoryTree,
    directoryMenuItems,
    getById: function (id) {
      return flatDirectories.value.find((d) => d.id === id);
    },
    select: function (dirId) {
      selectedDirectory.value = flatDirectories.value.find(
        (d) => d.id === dirId
      );
    },
    createDirectory: function (dirName, parentId) {
      const newDir = {
        id: dirName,
        name: dirName,
        parent: parentId,
        children: [],
      };

      flatDirectories.value.push(newDir);

      // trigger reactivity
      // eslint-disable-next-line no-self-assign
      flatDirectories.value = flatDirectories.value;

      computeProperties();
    },
    updateDirectory: function (update) {
      flatDirectories.value = [
        ...flatDirectories.value.filter((d) => d.id !== update.id),
        update,
      ];

      // trigger reactivity
      // eslint-disable-next-line no-self-assign
      flatDirectories.value = flatDirectories.value;

      computeProperties();
    },
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
