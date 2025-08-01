import { Tooltip } from "@/components/common/Tooltip";
import { useFieldStore } from "@/lib/store";
import { generateCSV, generateJSON, hasObjectOrArrayField } from "@/utils/fakerData";
import { File, FileCode, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ExportButtons = () => {
  const store = useFieldStore();
  const { t } = useTranslation("export"); // 👈 chỉ lấy key từ namespace export

  const handleExportCSV = () => {
    if (!store.generatedData || hasObjectOrArrayField(store.fields)) return;
    const csv = generateCSV(store.generatedData, store.fields);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fake_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    if (!store.generatedData) return;

    let html = "<table>";
    html += "<tr>";
    store.fields.forEach((field) => {
      html += `<th>${field.name}</th>`;
    });
    html += "</tr>";

    store.generatedData.forEach((row) => {
      html += "<tr>";
      store.fields.forEach((field) => {
        const value = row[field.name];
        html += `<td>${
          value === null
            ? "NULL"
            : typeof value === "object"
            ? Array.isArray(value)
              ? "[Array]"
              : "{Object}"
            : value?.toString()
        }</td>`;
      });
      html += "</tr>";
    });

    html += "</table>";

    const excelBlob = new Blob(
      [
        `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:x="urn:schemas-microsoft-com:office:excel" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
          <x:Name>Sheet1</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
        </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        </head>
        <body>${html}</body>
        </html>
      `,
      ],
      { type: "application/vnd.ms-excel" }
    );

    const url = URL.createObjectURL(excelBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fake_data.xls";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!store.generatedData) return;
    const json = generateJSON(store.generatedData);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fake_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasComplexFields = hasObjectOrArrayField(store.fields);

  return (
    <div className="flex gap-2">
      {/* CSV */}
      <Tooltip content={hasComplexFields ? t("tooltip.csvDisabled") : t("tooltip.csv")}>
        <button
          onClick={handleExportCSV}
          disabled={store.fields.length === 0 || hasComplexFields}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:opacity-50 dark:text-white
              border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          <FileText className="h-4 w-4" />
          {t("csv")}
        </button>
      </Tooltip>

      {/* Excel */}
      <Tooltip content={t("tooltip.excel")}>
        <button
          onClick={handleExportExcel}
          disabled={store.fields.length === 0 || hasComplexFields}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:opacity-50 dark:text-white 
              border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          <File className="h-4 w-4" />
          {t("excel")}
        </button>
      </Tooltip>

      {/* JSON */}
      <Tooltip content={t("tooltip.json")}>
        <button
          onClick={handleExportJSON}
          disabled={store.fields.length === 0 || hasComplexFields}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:opacity-50 dark:text-white
            border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          <FileCode className="h-4 w-4" />
          {t("json")}
        </button>
      </Tooltip>
    </div>
  );
};