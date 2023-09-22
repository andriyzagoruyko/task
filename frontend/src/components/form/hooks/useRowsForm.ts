import { useState } from "react";
import { RowInterface } from "../interfaces/row.interface";
import { AVAILABLE_LANGUAGES } from "../../../definitions/available-languages";

const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

export const EMPTY_ROW: RowInterface = {
  url: "",
  lang: "eng",
  isLinkValid: false,
  isLangValid: false,
  isTouched: false,
};

export const useRows = (onSubmit: (row: RowInterface) => Promise<any>) => {
  const [rows, setRows] = useState<RowInterface[]>([EMPTY_ROW]);

  const addRow = () => {
    setRows([...rows, { ...EMPTY_ROW, lang: rows[rows.length - 1].lang }]);
  };

  const updateRow = (index: number, updatedItem: RowInterface) => {
    const nextItems = [...rows];
    nextItems[index] = updatedItem;
    setRows(nextItems);
    validateRow(index, nextItems[index]);
  };

  const validateRow = (index: number, item: RowInterface) => {
    const nextItems = [...rows];
    const isLinkValid = !!item.url.match(URL_REGEX);
    const isLangValid = AVAILABLE_LANGUAGES.includes(item.lang);
    nextItems[index] = { ...item, isLinkValid, isLangValid, isTouched: true };
    setRows(nextItems);
  };

  const updateRowLink = (index: number, fileLink: string) =>
    updateRow(index, { ...rows[index], url: fileLink });

  const updateRowLang = (index: number, lang: string) =>
    updateRow(index, { ...rows[index], lang });

  const deleteRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleFormSubmit = async () => {
    for (const row of rows) {
      try {
        const res = await onSubmit(row);
        if (res) {
          setRows([EMPTY_ROW]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return {
    hasValidRows: rows.every((row) => row.isLinkValid && row.isLangValid),
    rows,
    setRows,
    updateRow,
    addRow,
    deleteRow,
    handleFormSubmit,
    updateRowLink,
    updateRowLang,
  };
};
