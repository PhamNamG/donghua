import { useMutation } from '@tanstack/react-query';
import { reportsApi, CreateReportPayload, CreateReportResponse } from '@/services/api/reports.api';

export function useCreateReport() {
    return useMutation<CreateReportResponse, unknown, CreateReportPayload>({
        mutationFn: (payload: CreateReportPayload) => reportsApi.create(payload),
    });
}

