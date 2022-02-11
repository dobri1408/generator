import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { useParams } from "react-router-dom";
import { PageHeader, Button } from "antd";
import { siteSchema } from "../../schemas";
import { v4 as uuidv4 } from "uuid";
import TableGeneratorModal from "../modals/TableGeneratorModal";
import FormGeneratorModal from "../modals/FormGeneratorModal";
import FieldGenerator from "../FieldGenerator";
import Navbar from "../pagesnavigation/Navbar";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../notification/SaveNotification";
const { Header, Content } = Layout;
function PageRender({ modalTableGenerator, setModalTableGenerator }) {
  let { country,pageName } = useParams();
  const countrySchema = siteSchema[country];
  console.log(countrySchema)
  const [tabName, setTabName] = useState("");
  const [tabSchema, setTabSchema] = useState([]);
  const [pageSchema, setPageSchema] = useState([]);
  const [configurationQuill, setConfigurationQuill] = useState({
    modules: {
      toolbar: false, // Snow includes toolbar by default
    },
    readOnly: true,
  });
  const [modalFormGenerator, setModalFormGenerator] = useState(false);
  useEffect(() => {
    const url = window.location.href;
    const lastSegment = url.split("/").pop();
    if (lastSegment === pageName) {
      if (pageSchema?.tabs?.length > 0) setTabName(pageSchema.tabs[0].tabName);
    } else setTabName(lastSegment);
  }, [pageSchema, window.location.href]);
  const checkErrors = () => {
    let foundIndex = countrySchema.findIndex((x) => x.pageName === pageName);
    let tabIndex = countrySchema[foundIndex].tabs.findIndex(
      (x) => x.tabName === tabName
    );
    !("errors" in countrySchema[foundIndex].tabs[tabIndex]) &&
      (countrySchema[foundIndex].tabs[tabIndex].errors = []);
    if (countrySchema[foundIndex].tabs[tabIndex].errors.length > 0) {
      return 1;
    }

    return 0;
  };

  useEffect(() => {
    if (!pageName.length) return;
    setPageSchema(countrySchema.find((element) => element.pageName === pageName));
  }, [pageName, countrySchema]);
  useEffect(() => {
    if (pageSchema.length === 0 || tabName.length === 0) return;

    setTabSchema(pageSchema.tabs.find((tab) => tab.tabName === tabName));
  }, [pageSchema, tabName, countrySchema]);

  return (
    <div>
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <PageHeader
          onBack={() => window.history.back()}
          title={pageName}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => {
                let foundIndex = countrySchema.findIndex(
                  (x) => x.pageName === pageName
                );

                let tabIndex = countrySchema[foundIndex].tabs.findIndex(
                  (x) => x.tabName === tabName
                );
                !("elements" in countrySchema[foundIndex].tabs[tabIndex]) &&
                  (countrySchema[foundIndex].tabs[tabIndex].elements = []);
                countrySchema[foundIndex].tabs[tabIndex]?.elements?.push({
                  type: "quill",
                  id: uuidv4(),
                  content: {},
                });
              }}
            >
              Add new Text Editor
            </Button>,
            <Button
              key="2"
              type="primary"
              onClick={() => {
                setModalFormGenerator(true);
              }}
            >
              Add new Form
            </Button>,
            <Button
              key="3"
              type="primary"
              onClick={() => {
                setModalTableGenerator(true);
              }}
            >
              Add new Table
            </Button>,
            <Button
              key="4"
              type="primary"
              onClick={() => {
                setConfigurationQuill({
                  modules: {
                    toolbar: false, // Snow includes toolbar by default
                  },
                  readOnly: true,
                });

                checkErrors()
                  ? openErrorNotification()
                  : openSuccessNotification();
              }}
            >
              Save
            </Button>,
          ]}
        />
      </Header>

      {pageName.length && (
        <>
          {" "}
          <Navbar pageName={pageName} currentTab={tabName} countrySchema={countrySchema} country={country}/>
          <TableGeneratorModal
            modalTableGenerator={modalTableGenerator}
            setModalTableGenerator={setModalTableGenerator}
            pageName={pageName}
            tabName={tabName}
          />
          <FormGeneratorModal
            modalFormGenerator={modalFormGenerator}
            setModalFormGenerator={setModalFormGenerator}
            pageName={pageName}
            tabName={tabName}
          />
        </>
      )}
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-block",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FieldGenerator
              tabSchema={tabSchema}
              pageName={pageName}
              configurationQuill={configurationQuill}
              setConfigurationQuill={setConfigurationQuill}
              tabName={tabName}
            />
          </div>
        </div>
      </Content>
    </div>
  );
}

export default PageRender;