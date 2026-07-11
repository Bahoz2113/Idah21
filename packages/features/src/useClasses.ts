import { trpc } from "@cezeri/trpc";

export function useClasses() {
  return trpc.classes.list.useQuery();
}

export function useClass(id: string) {
  return trpc.classes.get.useQuery({ id }, { enabled: !!id });
}

export function useCreateClass() {
  const utils = trpc.useUtils();
  return trpc.classes.create.useMutation({
    onSuccess: () => utils.classes.list.invalidate(),
  });
}

export function useAgeGroups() {
  return trpc.lookup.ageGroups.useQuery();
}

export function useTeachers() {
  return trpc.teachers.list.useQuery();
}
