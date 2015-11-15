A very simple **static list** component with built-in "sort by", and livesearch functionality.

Render it with:

```
render() {
	return <List items={items} filterBy="_all" />
}
```

Where `items` is an array of objects.

Property/keys that are *capitalized* are automatically turned into columns of the table, and buttons will be created for each column to allow sorting.

Objects must have a unique property/key called `id`.

`filterBy` is the property/key to perform livesearch `regex.match` on.