import ReactSelect, { GroupBase, OptionsOrGroups } from "react-select";
import TuSelect from "../components/TuSelect";

const RFPage = () => {
    const opts = [
        {
            value: 1,
            label: "One",
        },
        {
            value: 2,
            label: "Two",
        },
        {
            value: 3,
            label: "Three",
        },
    ];
    return (
        <div className="p-5 mt-5 relative">
          <TuSelect options={opts} placeholder="Numbers..." onChange={(e)=> {console.log(e?.value);}} />
          <div className="mt-4"><h1>Hello</h1></div>
        </div>
    );
};

export default RFPage;
