import { useState } from "react";
import { IRow } from "../Rows";
import { ApiRouteEnum } from "../../../definitions/api-routes";
import { makeRequest } from "../../../helpers/makeRequest";

const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

export const EMPTY_ROW = {
  fileUrl: "",
  lang: "",
  isLinkValid: false,
  isLangValid: false,
  isTouched: false,
};

export const useRows = () => {
  const [rows, setRows] = useState<IRow[]>([EMPTY_ROW]);
  const [hasAddedAssets, setHasAddedAssets] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      isLinkValid: !!item.fileUrl.match(URL_REGEX),
      isLangValid: !!item.lang,
      isTouched: true,
    };
    setRows(nextItems);
  };

  const addRow = () => {
    setRows([...rows, EMPTY_ROW]);
    setHasAddedAssets(false);
  };

  const createSingleAsset = async (row: IRow, userId: string) => {
    const { fileUrl, lang } = row;
    setError("");
    setIsLoading(true);
    await makeRequest(ApiRouteEnum.ENQUEUE_FILE, "POST", {
      fileUrl,
      lang,
      userId,
    }).finally(() => setIsLoading(false));
  };

  const createAssetsFromRows = async (userId: string | null) => {
    for (const row of rows) {
      try {
        if (!userId) {
          throw new Error("Connection issue, please try again");
        }
        await createSingleAsset(row, userId);
        setHasAddedAssets(true);
        setRows([EMPTY_ROW]);
      } catch (e: any) {
        const message = e.response?.data?.message ?? e.message;
        setError(message);
      }
    }
  };

  const deleteRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

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
    error,
    setError,
    isLoading,
    setIsLoading,
  };
};
