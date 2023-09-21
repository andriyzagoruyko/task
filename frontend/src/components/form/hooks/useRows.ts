import { useEffect, useState } from "react";
import { IRow } from "../rows";
import { useMutation } from "@apollo/client";
import { ALL_FILES, ENQUEUE_FILE } from "../../../apollo/file";
import { AssetEntityInterface } from "../../assets/asset-card";

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
  const [hasAddedAssets, setHasAddedAssets] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [enqueueFile, { loading, error }] = useMutation(ENQUEUE_FILE, {
    update: (cache, { data: { newAsset } }) => {
      const { assets } = cache.readQuery({ query: ALL_FILES }) as {
        assets: AssetEntityInterface[];
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

  const createSingleAsset = async (row: IRow) => {
    const { url, lang } = row;
    try {
      return await enqueueFile({ variables: { url, lang } });
    } catch {}
    return null;
  };

  const createAssetsFromRows = async () => {
    setHasAddedAssets(false);
    for (const row of rows) {
      const res = await createSingleAsset(row);
      if (res) {
        setHasAddedAssets(true);
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
