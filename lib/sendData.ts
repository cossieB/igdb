type Methods = "GET" | "POST" | "PUT" | "DELETE"
export default async function sendData<T = any>(url: string, method?: "GET"): Promise<T>;
export default async function sendData<T = any>(url: string, method: Exclude<Methods, "GET"> , body: BodyInit): Promise<T>;
export default async function sendData<T = any>(url: string, method?: Methods, body?: BodyInit) {
    
    method = method || "GET";
    const obj: RequestInit = {
        method
    }
    if (body) {
        obj.headers = {
            "Content-Type": "application/json"
        }
        obj.body = JSON.stringify(body)
    }
    const response = await fetch(url, obj)
    if (!response.ok) throw new Error("Something went wrong")

    const data: T = await response.json()

    return data
}

