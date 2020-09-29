type routedocs = {
    url: string,
    method: string,
    param:
    {
        name: string,
        description: string
    }[],
    body: any
}

export default routedocs;