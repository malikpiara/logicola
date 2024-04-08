import { Sidebar } from "@/components/sidebar";
import TopicTable from "@/components/topicTable";

export const metadata = {
  title: "Logicola | Basic Propositional Logic",
  description:
    "Basic Propositional Logic exercises. Translating from natural language to symbolic form. LogiCola is a program to help students learn logic.",
};

export default function BasicPropositionalLogic() {
  return (
    <>
      <div className="flex w-full h-screen overflow-scroll">
        <Sidebar />
        <div className="p-4 w-full">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            Chapter 6: Basic Propositional Logic
          </h1>
          <TopicTable />
        </div>
      </div>
    </>
  );
}
