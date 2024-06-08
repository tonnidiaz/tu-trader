import { useRouter } from "next/router";

const UserRF = () => {
    const router = useRouter()
    return ( <div className="p-5">
        <h1>{router.query.username}'s RF</h1>
    </div> );
}
 
export default UserRF;