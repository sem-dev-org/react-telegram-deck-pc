import { fetchApiByToken } from "./client";

export const getTournamentList = async (data: any = {}) => {
    const response = await fetchApiByToken('/Tournament/getTournamentList', {
        method: 'post',
        body: JSON.stringify(data),
    });
    return response;
};

export const getTournament = async (data: any) => {
    const response = await fetchApiByToken('/Tournament/index', {
        method: 'post',
        body: JSON.stringify(data),
    });
    return response;
};

export const getTournamentConfig = async (data: any) => {
    const response = await fetchApiByToken('/Tournament/getTournamentConfig', {
        method: 'post',
        body: JSON.stringify(data),
    });
    return response;
};

export const getUserTournamentInfo = async (data: any) => {
    const response = await fetchApiByToken('/Tournament/getUserTournamentInfo', {
        method: 'post',
        body: JSON.stringify(data),
    });
    return response;
};

export const getPoolPrize = async (data: any) => {
    const response = await fetchApiByToken('/Tournament/getPoolPrize', {
        method: 'post',
        body: JSON.stringify(data),
    });
    return response;
};  

export const getTournamentLeaderboard = async (data: any) => {
    const response = await fetchApiByToken('/Tournament/getTournamentLeaderboard', {
        method: 'post',
        body: JSON.stringify(data),
    });
    return response;
};

export const getTournamentGameList = async (data: any) => {
    const response = await fetchApiByToken('/Tournament/getTournamentGameList', {
        method: 'post',
        body: JSON.stringify(data),
    });
    return response;
};