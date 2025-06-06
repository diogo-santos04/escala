import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    logoutButton: {
        backgroundColor: "#FF6347",
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    logoutText: {
        color: "#fff",
        fontWeight: "bold",
    },
    formContainer: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
    },
    input: {
        height: 45,
        backgroundColor: "#F5F5F5",
        marginBottom: 14,
        borderRadius: 8,
        paddingHorizontal: 12,
        color: "#333",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    button: {
        height: 45,
        backgroundColor: "#3fffa3",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#101026",
    },
    tableContainer: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 8,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tableTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#F0F0F0",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    tableHeaderText: {
        fontWeight: "bold",
        paddingHorizontal: 6,
        color: "#666",
    },
    tableContent: {
        flex: 1,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    tableCell: {
        color: "#333",
        paddingHorizontal: 6, // adiciona espaço entre colunas
        textAlign: "left",
    },

    idColumn: {
        flex: 0.5,
    },
    nameColumn: {
        flex: 1.5,
    },
    descColumn: {
        flex: 2,
    },
    actionColumn: {
        flex: 1,
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    deleteButton: {
        backgroundColor: "#FF6B6B",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    deleteButtonText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    editButton: {
        backgroundColor: "#3fffa3",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    editButtonText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    emptyText: {
        textAlign: "center",
        padding: 20,
        color: "#999",
    },
    loadingText: {
        textAlign: "center",
        padding: 20,
        color: "#999",
    },
    refreshButton: {
        marginTop: 16,
        backgroundColor: "#6979F8",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
    },
    refreshButtonText: {
        color: "#FFF",
        fontWeight: "bold",
    },
    checkbox: {
        marginRight: 10,
    },
    checkboxContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: 16,
        marginTop: 8,
        marginLeft: 5,
    },

    checkboxLabel: {
        fontSize: 16,
        color: "#333",
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    statusActive: {
        backgroundColor: "#10B981",
    },
    statusInactive: {
        backgroundColor: "#F87171",
    },
    statusText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 12,
    },
    formLabel: {
        fontSize: 14,
        color: "#0000000",
        // marginBottom: 8,
        // marginTop: 12,
        padding: 6,
    },

    smallColumn: {
        flex: 0.8,
        padding: 4,
    },
    listSection: {
        flex: 1,
        backgroundColor: "#16162a",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginLeft: 8,
    },
    listContent: {
        paddingBottom: 8,
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    itemContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    selectedSection: {
        flex: 1,
        backgroundColor: "#16162a",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    selectedListContent: {
        paddingBottom: 8,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#rgba(217, 34, 34, 0.77)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    itemMatricula: {
        fontSize: 14,
        color: "#aaa",
        marginTop: 2,
    },
    addButton: {
        backgroundColor: "#27ae60",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    selectedItemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        backgroundColor: "rgba(52, 152, 219, 0.15)",
        marginBottom: 8,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#3498db",
    },
    selectedAvatar: {
        backgroundColor: "#27ae60",
    },
    selectedItemName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    selectedItemMatricula: {
        fontSize: 14,
        color: "#aaa",
        marginTop: 2,
    },
    removeButton: {
        backgroundColor: "#e74c3c",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#101026",
    },
});
