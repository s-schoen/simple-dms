import { ref, reactive } from "vue";
import dms from "@/api/simple-dms";

const documents = ref([]);
const loadingState = reactive({
  loading: false,
  success: true,
  error: null,
});

export default function () {
  return {
    documents,
    loadingState,
    fetchAll: function () {
      loadingState.loading = true;
      dms
        .fetchDirectories()
        .then((docs) => {
          documents.value = docs;
          loadingState.success = true;
        })
        .catch((error) => {
          loadingState.success = false;
          loadingState.error = error;

          console.error("Error while fetching all documents", error);
        })
        .finally(() => (loadingState.loading = false));
    },
  };
}
