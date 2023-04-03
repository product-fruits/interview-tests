const multipartUploads: MultipartUpload[] = [];

interface MultipartUpload {
    identifier: string
    parts: MultipartUploadPart[]
    isCompleted: boolean
}

interface MultipartUploadPart {
    number: number
    etag: string
    data: string
}

export interface PartDescriptor {
    number: number
    etag: string
}

export function initMultipartUpload(): string {
    const identifier = crypto.randomUUID();
    const newMultipartUpload: MultipartUpload = {
        identifier: identifier,
        parts: [],
        isCompleted: false
    }

    multipartUploads.push(newMultipartUpload)

    return identifier
}

function getMultipartUpload(multipartIdentifier: string) {
    const multipartUploadList = multipartUploads.filter(x => x.identifier == multipartIdentifier);

    if (multipartUploadList.length == 0) {
        throw Error(`Multipart with given identifier ${multipartIdentifier} not found`)
    }

    if (multipartUploadList.length > 1) {
        throw Error(`!!!!! TEST MOCKUP FRAMEWORK IMPLEMENTATION ERROR !!!!! Multipart with given identifier ${multipartIdentifier} has ${multipartUploadList.length} orrucences`)
    }

    const multipartUpload = multipartUploadList[0]

    return multipartUpload;
}

export function uploadPart(multipartIdentifier: string, partNumber: number, data: string): string {
    const multipartUpload = getMultipartUpload(multipartIdentifier)

    assertNotCompleted(multipartUpload)

    const newEtag = crypto.randomUUID();
    const newMultipartUploadPart: MultipartUploadPart = {
        number: partNumber,
        etag: newEtag,
        data: data
    }

    multipartUpload.parts[partNumber] = newMultipartUploadPart;

    return newEtag
}

export function completeMultipartUpload(multipartIdentifier: string, partDescriptors: PartDescriptor[]): void {
    const multipartUpload = getMultipartUpload(multipartIdentifier)
    
    assertNotCompleted(multipartUpload)

    const finalParts: MultipartUploadPart[] = []

    partDescriptors.forEach(partDescriptor => {
        const partFound = multipartUpload.parts[partDescriptor.number]
        if (!partFound) {
            throw Error(`Part with number ${partDescriptor.number} not found`)
        }

        if (partFound.etag !== partDescriptor.etag) {
            throw Error(`Part with number ${partDescriptor.number} has invalid ETag ${partDescriptor.etag}`)
        }

        finalParts[partDescriptor.number] = partFound
    });

    const finalPartsCondensed = Object.values(finalParts)

    multipartUpload.parts = finalPartsCondensed
    multipartUpload.isCompleted = true
}

function assertNotCompleted(multipartUpload: MultipartUpload) {
    if (multipartUpload.isCompleted) {
        throw Error(`Multipart upload ${multipartUpload.identifier} is already completed`)
    }
}

export function testMultipartUpload() {
    if (multipartUploads.length != 1) {
        throw Error(`There should be one upload. Found ${multipartUploads.length}`)
    }

    const multipartUpload = multipartUploads[0]
    if (!multipartUpload.isCompleted) {
        throw Error(`Upload not completed.`)
    }

    if (multipartUpload.parts.length != 100000) {
        throw Error(`Wrong number of items in upload (${multipartUpload.parts.length}); should be 100000`)
    }

    let expectedOrder = 1;
    multipartUpload.parts.forEach(part => {
        if (!part.data) {
            throw Error(`Part data missing`)
        }

        var dataParts = part.data.split(',')
        
    });
}