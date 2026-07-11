import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useClasses } from "@cezeri/features";   // <-- web ile birebir aynı hook

export function SiniflarScreen() {
  const classes = useClasses();
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#0B1F3A" }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>Sınıflar</Text>
      {classes.isLoading && <ActivityIndicator color="#1FC8C8" />}
      <FlatList
        data={classes.data ?? []}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "#13294d", borderRadius: 12, padding: 12, marginBottom: 8 }}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: "#9fb3d1", fontSize: 12 }}>
              {item.ageGroup?.name ?? "—"} · {item._count.students} öğrenci
            </Text>
          </View>
        )}
        ListEmptyComponent={!classes.isLoading ? <Text style={{ color: "#9fb3d1" }}>Kayıt yok.</Text> : null}
      />
    </View>
  );
}
