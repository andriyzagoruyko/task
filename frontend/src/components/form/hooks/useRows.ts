import { useEffect, useState } from "react";
import { IRow } from "../rows";
import { useMutation } from "@apollo/client";
import { ALL_FILES, ENQUEUE_FILE } from "../../../api/apollo/requests/file";
import { FileEntityInterface } from "../../files/interfaces/file-entity.interface";

const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

export const EMPTY_ROW: IRow = {
  url: "",
  lang: "eng",
  isLinkValid: false,
  isLangValid: false,
  isTouched: false,
};

export const useRows = () => {
  const [rows, setRows] = useState<IRow[]>([EMPTY_ROW]);
  const [hasAddedFiles, setHasAddedFiles] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [enqueueFile, { loading, error }] = useMutation(ENQUEUE_FILE, {
    update: (cache, { data: { newFile } }) => {
      const data = cache.readQuery<{ files: FileEntityInterface[] }>({
        query: ALL_FILES,
      });
      if (data) {
        cache.writeQuery({
          query: ALL_FILES,
          data: { files: [newFile, ...data.files] },
        });
      }
    },
  });

  const updateRow = (index: number, updatedItem: IRow) => {
    const nextItems = [...rows];
    nextItems[index] = updatedItem;
    setRows(nextItems);
    validateRow(index, nextItems[index]);
  };

  const validateRow = (index: number, item: IRow) => {
    const nextItems = [...rows];
    nextItems[index] = {
      ...item,
      isLinkValid: !!item.url.match(URL_REGEX),
      isLangValid: !!item.lang,
      isTouched: true,
    };
    setRows(nextItems);
  };

  const addRow = () => {
    setRows([...rows, { ...EMPTY_ROW, lang: rows[rows.length - 1].lang }]);
    setHasAddedFiles(false);
  };

  const createSingleFile = async (row: IRow) => {
    const { url, lang } = row;
    try {
      return await enqueueFile({ variables: { url, lang } });
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const createFilesFromRows = async () => {
    setHasAddedFiles(false);
    for (const row of rows) {
      const res = await createSingleFile(row);
      if (res) {
        setHasAddedFiles(true);
        setRows([EMPTY_ROW]);
      }
    }
  };

  const deleteRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error?.message);
    }
  }, [error]);

  const cleanErrorMessage = () => setErrorMessage("");

  return {
    rows,
    setRows,
    updateRow,
    hasAddedFiles,
    setHasAddedFiles,
    addRow,
    deleteRow,
    createSingleFile,
    createFilesFromRows,
    cleanErrorMessage,
    errorMessage,
    loading,
  };
};
