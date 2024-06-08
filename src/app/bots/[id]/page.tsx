import { api } from "@/src/utils/constants";
import PageComponent from "./PageComponent";
import { IGetData, TGetData } from "@/src/utils/interfaces";

const getData: TGetData = async (id: string) => {
    try {
        const res = await api().get("/bots/" + id);

        return { data: res.data };
    } catch (e: any) {
        const code = e.response?.status ?? 500;
        const msg =
            typeof e.response?.data == "string" &&
            e.response?.data?.startsWith("tuned:")
                ? e.response.data.replace("tuned:", "")
                : "Something went wrong";
        return { err: { msg, code } };
    }
};

const Page = async ({ params: { id } }) => {
    const { data, err } = await getData(id);

    return <PageComponent bot={data} err={err} />;
};

export default Page;
