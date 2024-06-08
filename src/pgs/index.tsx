import TuMeta from "../components/TuMeta";
import { SITE } from "../utils/constants";

const Home = () => {
    return ( <div className="w-100p h-100p flex flex-col items-center justify-center">
        <TuMeta/>
        <h1 className="fs-45 fw-8">{SITE}</h1>
        <p>A Trading Bot from <b>Tunedbass</b></p>
    </div> );
}
 
export default Home;