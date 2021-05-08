import { reactive, ref, watch } from "vue";
import dms from "@/api/simple-dms";

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
const selectedDirectory = ref(null);
const loadingState = reactive({
  loading: false,
  success: true,
  error: null,
});

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

  // eslint-disable-next-line no-self-assign
  directoryTree.value = directoryTree.value;
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
    loadingState,
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

      // insert using api
      loadingState.loading = true;
      dms
        .insertDirectory(newDir)
        .then((d) => {
          console.log("NEW DIR", d);

          flatDirectories.value.push(d);

          // trigger reactivity
          // eslint-disable-next-line no-self-assign
          flatDirectories.value = flatDirectories.value;

          computeProperties();

          loadingState.success = true;
        })
        .catch((error) => {
          loadingState.success = false;
          loadingState.error = error;

          console.error("Error while inserted directory", newDir, error);
        })
        .finally(() => (loadingState.loading = false));
    },
    updateDirectory: function (update) {
      // update using api
      loadingState.loading = true;
      dms
        .updateDirectory(update)
        .then((updatedDir) => {
          flatDirectories.value = [
            ...flatDirectories.value.filter((d) => d.id !== updatedDir.id),
            updatedDir,
          ];

          // trigger reactivity
          // eslint-disable-next-line no-self-assign
          flatDirectories.value = flatDirectories.value;

          computeProperties();

          loadingState.success = true;
        })
        .catch((error) => {
          loadingState.success = false;
          loadingState.error = error;

          console.error("Error while upating directory", update, error);
        })
        .finally(() => (loadingState.loading = false));
    },
    deleteDirectory: function (directoryId) {
      // delete using api
      loadingState.loading = true;
      dms
        .deleteDirectory(directoryId)
        .then(() => {
          loadingState.success = true;

          flatDirectories.value = flatDirectories.value.filter(
            (d) => d.id !== directoryId
          );

          // trigger reactivity
          // eslint-disable-next-line no-self-assign
          flatDirectories.value = flatDirectories.value;
        })
        .catch((error) => {
          loadingState.success = false;
          loadingState.error = error;

          console.error("Error while deleting directory", directoryId, error);
        })
        .finally(() => (loadingState.loading = false));
    },
    fetch: function () {
      loadingState.loading = true;
      dms
        .fetchDirectories()
        .then((ds) => {
          flatDirectories.value = ds;
          computeProperties();

          loadingState.success = true;
        })
        .catch((error) => {
          loadingState.success = false;
          loadingState.error = error;

          console.error("Could not fetch directories", error);
        })
        .finally(() => (loadingState.loading = false));
    },
  };
}
