class ApiClient {
    
    private getApiUrl(): string {

        const serverUrl = process.env.NEXT_SERVER_API_URL
        const publicUrl = process.env.NEXT_PUBLIC_API_URL
    
        // Проверяем, находимся ли мы на серверной стороне
        const isServer = typeof window === 'undefined';
    
        // На сервере используем serverRuntimeConfig, на клиенте — publicRuntimeConfig
        return isServer
          ? serverUrl || 'http://host.docker.internal:4000/api'
          : publicUrl || 'http://localhost:4000/api';
      }


    private buildUrlWithQuery(url: string, query?: any): string {
        if (!query) return url;

        const queryString = new URLSearchParams(query).toString();
        return `${url}?${queryString}`;
    }


    private async request(method: string, url: string, query?: any, data?: any, token?: string): Promise<Response> {

        const apiUrl = this.getApiUrl()
        const finalUrl = this.buildUrlWithQuery(`${apiUrl}${url}`, query);

        let init: RequestInit = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            } as HeadersInit,
            credentials: 'include',
        };

        if (token) {
            (init.headers as { [key: string]: string })['Authorization'] = `Bearer ${token}`;
        }

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
