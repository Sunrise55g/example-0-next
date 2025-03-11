class ApiClient {
    private backendUrl: string;

    constructor() {
        this.backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    }


    private buildUrlWithQuery(url: string, query?: any): string {
        if (!query) return url;

        const queryString = new URLSearchParams(query).toString();
        return `${url}?${queryString}`;
    }


    private async request(method: string, url: string, query?: any, data?: any, token?: string): Promise<Response> {

        const finalUrl = this.buildUrlWithQuery(`${this.backendUrl}${url}`, query);

        let init: RequestInit = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            } as HeadersInit,
            credentials: 'include',
        };

        // Add Authorization header if token is provided
        if (token) {
            (init.headers as { [key: string]: string })['Authorization'] = `Bearer ${token}`;
        }

        // Add body if data is provided
        // console.log('request: data:', data);
        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            init.body = JSON.stringify(data);
        }

        // console.log('request: finalUrl:', finalUrl);
        // console.log('request: init:', init);

        try {
            const response = await fetch(finalUrl, init);

            const responseData: any = await response.json();
            // console.log('request: responseData:', responseData);

            return responseData;
        } 
        catch (error) {
            console.error('request: Error:', error);
            throw error;
        }
    }


    public get(url: string, query?: any, token?: string): Promise<Response> {
        return this.request('GET', url, query, undefined, token);
    }

    public post(url: string, data: any, token?: string): Promise<Response> {
        return this.request('POST', url, undefined, data, token);
    }

    public patch(url: string, data: any, token?: string): Promise<Response> {
        return this.request('PATCH', url, undefined, data, token);
    }

    public put(url: string, data: any, token?: string): Promise<Response> {
        return this.request('PUT', url, undefined, data, token);
    }

    public delete(url: string, token?: string): Promise<Response> {
        return this.request('DELETE', url, undefined, undefined, token);
    }

}

export const apiClient = new ApiClient();
