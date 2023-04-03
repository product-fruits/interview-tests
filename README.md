# interview-tests
Welcome!

## Setup
You will need Visual Studio Code and Live Share extension.

## Repository
`nodejs/0001` contains sample application. Your task is to create implementation in `nodejs/0001/src/job.ts`. Rest of files is not important for you, it's just testing/reviewing framework.

## What you have
You don't need to import anything else. Your job has everything prepared.

### Mongo
In `job.ts` you have `MongoClient` class available. Just instantiate it like ordinary `MongoClient`. You don't need any connection string. It has some restricted set of methods analogous to real Mongo driver.

Your working Mongo DB is `test_0001`. There is collection with source data prepared for you. Its name is `source_data` :) It contains 100.000 documents which you should process in the method.

### Sink
Second library is `sink`. It consumes transformed data.

`function initMultipartUpload(): string` creates new Multipart upload and returns its identifier. You will feed the data into one Multipart upload.

`function uploadPart(multipartIdentifier: string, partNumber: number, data: string): string` uploads one part of the data. The `partNumber` is ordering of your part. If you upload data to same `partNumber` twice the latter will overwrite data of the former upload. But it's up to you whether you will number the parts like `1, 2, 3` of `10, 15, 100`. Just the ordering is important. The method returns `ETag` which is needed to check upload consistency.

`function completeMultipartUpload(multipartIdentifier: string, partDescriptors: PartDescriptor[]): void` completes the Multipart upload. It takes descriptors of all parts which should be in the resulting upload (typically all of them).

```
export interface PartDescriptor {
    number: number
    etag: string
}
```

The `number` is number of part and `etag` is value returned from `UploadPart()` function. `etag` is used to ensure consistency. If it doesn't match the value returned by `uploadPart()` the `completeMultipartUpload()` call fails.

### Job
Your job has restricted lifetime. Your `process()` function has `shouldEnd` callback. Whenever the callback returns `true` your job is about to die (timeout). That means you have to save your current state and resume when your job is called again. If `shouldEnd()` returns `true`, it means you can do just less than 1.200 Mongo operations left (retrieving 1 document from cursor also counts as operation). Your method should save its state and end ASAP with result `ProcessResult.NotYetDone`.

## The task
You need to:
* Take all data from source data Mongo collection.
* Order them by `order` field; the `order` field value is unique among all documents; its values are greater than `0`.
* Transform them to output format.
* Send the output data to sink.

Source data look like this:
```
/* 1 */
{
    "_id" : ObjectId("6426bc7a43b2bdaf4efe65b8"),
    "first_name" : "Exciting",
    "last_name" : "Randene",
    "index" : 1,
    "order" : 100
}

/* 2 */
{
    "_id" : ObjectId("6426bc7a43b2bdaf4efe668c"),
    "first_name" : "Promising",
    "last_name" : "Ranna",
    "index" : 213,
    "order" : 288
}

/* 3 */
{
    "_id" : ObjectId("6426bc7a43b2bdaf4efe66e1"),
    "first_name" : "Continuing",
    "last_name" : "Hedi",
    "index" : 298,
    "order" : 203
}

/* 4 */
{
    "_id" : ObjectId("6426bc7a43b2bdaf4efe69d7"),
    "first_name" : "Printed",
    "last_name" : "Aurelie",
    "index" : 1056,
    "order" : 1045
}
```

The resulting data is composed of source data in this format:
```
{order},{index},{first_name},{last_name}
```

In our case the records will be:
```
100,1,Exciting,Randene
203,298,Continuing,Hedi
288,213,Promising,Ranna
1045,1056,Printed,Aurelie
```

The 4 records will be sent to `sink` as 4 separate parts of one multipart upload.

When your job returns `ProcessResult.NotYetDone` it means its task is not done yet and it needs to be called again to continue when it left off. If it returns `ProcessResult.Finished` it means the task is done and the output data is ready to be checked.

At this time all temporary data (documents) in Mongo should be cleaned up. Remaining empty collections are OK.
