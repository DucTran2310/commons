import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enDocs from "@/locales/en/generateData/docs.json";
import viDocs from "@/locales/vi/generateData/docs.json";
import enExport from "@/locales/en/generateData/export.json";
import viExport from "@/locales/vi/generateData/export.json";
import enField from "@/locales/en/generateData/field.json";
import viField from "@/locales/vi/generateData/field.json";
import enFakeData from "@/locales/en/generateData/fakeData.json";
import viFakeData from "@/locales/vi/generateData/fakeData.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        docs: enDocs,
        export: enExport,
        field: enField,
        fakeData: enFakeData,
      },
      vi: {
        docs: viDocs,
        export: viExport,
        field: viField,
        fakeData: viFakeData,
      },
    },
    fallbackLng: "en",
    ns: ["docs", "export", "field", "fakeData"],
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
