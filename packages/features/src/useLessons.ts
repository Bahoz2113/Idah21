import { trpc } from "@cezeri/trpc";
import { createBrowserClient } from "@cezeri/auth";

const BUCKET = "materials";

export function useLessons(classId: string) {
  return trpc.lessons.listByClass.useQuery({ classId }, { enabled: !!classId });
}

export function useCreateLesson() {
  const u = trpc.useUtils();
  return trpc.lessons.create.useMutation({
    onSuccess: (_, vars) => u.lessons.listByClass.invalidate({ classId: vars.classId }),
  });
}

export function useLessonMaterials(lessonId: string) {
  return trpc.materials.listByLesson.useQuery({ lessonId }, { enabled: !!lessonId });
}

// Dosyayı doğrudan Supabase Storage'a yükler, sonra DB kaydı oluşturur (çocuk görseli YOK)
export function useUploadMaterial(lessonId: string) {
  const u = trpc.useUtils();
  const reqUpload = trpc.materials.requestUpload.useMutation();
  const confirm = trpc.materials.confirm.useMutation({
    onSuccess: () => u.materials.listByLesson.invalidate({ lessonId }),
  });

  async function upload(file: File, type: string, title?: string) {
    const { path, token } = await reqUpload.mutateAsync({ lessonId, fileName: file.name });
    const supabase = createBrowserClient();
    const { error } = await supabase.storage.from(BUCKET).uploadToSignedUrl(path, token, file);
    if (error) throw error;
    await confirm.mutateAsync({ lessonId, type: type as any, url: path, title: title ?? file.name });
  }
  async function addLink(url: string, title?: string) {
    await confirm.mutateAsync({ lessonId, type: "LINK", url, title });
  }
  return { upload, addLink, pending: reqUpload.isPending || confirm.isPending };
}
