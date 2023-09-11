import { useEffect, useState } from "react";
import { IRow } from "../Rows";
import { useMutation } from "@apollo/client";
import { ALL_FILES, ENQUEUE_FILE } from "../../../apollo/file";
import { IAsset } from "../../Assets/AssetCard";

const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

export const EMPTY_ROW: IRow = {
  url: "",
  lang: "",
  isLinkValid: false,
  isLangValid: false,
  isTouched: false,
};

export const useRows = () => {
  const [rows, setRows] = useState<IRow[]>([EMPTY_ROW]);
  const [hasAddedAssets, setHasAddedAssets] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [enqueueFile, { loading, error }] = useMutation(ENQUEUE_FILE, {
    update: (cache, { data: { newAsset } }) => {
      const { assets } = cache.readQuery({ query: ALL_FILES }) as {
        assets: IAsset[];
      };
      cache.writeQuery({
        query: ALL_FILES,
        data: { assets: [newAsset, ...assets] },
      });
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
    setHasAddedAssets(false);
  };

  const createSingleAsset = async (row: IRow, socketId: string | null) => {
    const { url, lang } = row;
    await enqueueFile({ variables: { url, lang, socketId } });
  };

  const createAssetsFromRows = async (socketId: string | null) => {
    for (const row of rows) {
      await createSingleAsset(row, socketId);
      setHasAddedAssets(true);
      setRows([EMPTY_ROW]);
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
    hasAddedAssets,
    setHasAddedAssets,
    addRow,
    deleteRow,
    createSingleAsset,
    createAssetsFromRows,
    cleanErrorMessage,
    errorMessage,
    loading,
  };
};
