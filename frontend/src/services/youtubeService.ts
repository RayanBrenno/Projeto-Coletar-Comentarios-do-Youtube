import api from "./api";
import {
  type CheckVideoResponse,
  type ConsultResponse,
  type HistoryVideo,
  type UpdateVideoResponse,
} from "../types/video";

export function getApiErrorMessage(err: unknown): string {
  const error = err as {
    response?: {
      data?: {
        detail?: string | Array<{ msg?: string }>;
      };
    };
  };

  const detail = error?.response?.data?.detail;

  let message = "Não foi possível realizar a operação.";

  if (typeof detail === "string") {
    message = detail;
  } else if (Array.isArray(detail) && detail.length > 0) {
    message = detail[0]?.msg || message;
  }

  return message;
}

interface VideoRequestPayload {
  url: string;
  user_id: string;
}

export async function checkVideoAlreadyConsulted(
  payload: VideoRequestPayload,
): Promise<CheckVideoResponse> {
  const { data } = await api.post<CheckVideoResponse>(
    "/youtube/check-video",
    payload,
  );

  return data;
}

export async function consultYoutubeVideo(
  payload: VideoRequestPayload,
): Promise<ConsultResponse> {
  const { data } = await api.post<ConsultResponse>(
    "/youtube/full-data",
    payload,
  );

  return data;
}

export async function getYoutubeHistory(
  userId: string,
): Promise<HistoryVideo[]> {
  const { data } = await api.get<HistoryVideo[]>(
    `/youtube/history/${userId}`,
  );

  return Array.isArray(data) ? data : [];
}

export async function updateYoutubeVideoById(
  videoId: string,
  userId: string,
): Promise<UpdateVideoResponse> {
  const { data } = await api.post<UpdateVideoResponse>(
    `/youtube/videos/${videoId}/update?user_id=${userId}`,
  );

  return data;
}