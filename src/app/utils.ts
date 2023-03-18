export const parseIfNeeded = (data: string) => {
    try {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        return data;
    } catch (error) {
        return data;
    }
}