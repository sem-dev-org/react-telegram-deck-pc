import { getKycDetail, getUserProfile } from "@/api/profile";
import { useAuth } from "@/contexts/auth";
import { KycDetail } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";

export const QueryUserProfile = () => {
    const { data ,refetch} = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
    });

    return {
        status: data?.status,
        user: data?.user,
        refetch
    };
};

export const QueryKycDetail = () => {
    const { user } = useAuth();
    const defaultKycDetail: KycDetail = {
        id: 0,
        team_id: 0,
        user_id: 0,
        first_name: '',
        middle_name: '',
        last_name: '',
        birthday: '',
        country: '',
        state: '',
        city: '',
        address: '',
        zip_code: '',
        document_type: 0,
        document_url: '',
        status: 0,
        created_at: 0,
        updated_at: 0
    };
    
    const { data = { data: defaultKycDetail, code: 0 }, refetch } = useQuery<{data: KycDetail, code: number}>({
        queryKey: ["kycDetail"],
        queryFn: getKycDetail,
        enabled: !!user,
    });

    return {
        data: data && data.code === 0 ? data?.data : defaultKycDetail,
        refetch
    };
};
