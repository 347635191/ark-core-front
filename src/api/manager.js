import axios from "@/axios";

export function queryUserRecord () {
    return axios.get("/stat/user/query")
}

export function queryTeamRecord () {
    return axios.get("/stat/team/query")
}

export function queryTeamRank (month) {
    return axios.get("/echarts/team/rank/query?month=" + month)
}

export function queryMenu () {
    return axios.get("/menu/query")
}