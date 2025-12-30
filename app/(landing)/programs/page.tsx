

import MiniNavbar from "@/components/landing/MiniNavbar";
import Recreational from "@/components/landing/Recreational";
import Pathway from "@/components/landing/Pathway";
import JuniorAcademy from "@/components/landing/JuniorAcademy";
import Select from "@/components/landing/Select";
import Crest from "@/components/landing/Crest";
import HistoryBar from "@/components/landing/HistoryBar";


const Programs = () => {
  return (
    <div className="max-w-full overflow-hidden">
        <MiniNavbar />
        <Recreational />
        <Pathway />
        <JuniorAcademy />
        <Crest />
        <Select />
        <HistoryBar />

        
      
     
    </div>
  );
};

export default Programs;
