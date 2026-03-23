export async function loadRows(table, options = {}) {
  const params = new URLSearchParams({ table });

  if (options.limit != null) {
    params.set("limit", String(options.limit));
  }

  if (options.orderBy) {
    params.set("order_by", options.orderBy);
  }

  if (options.direction) {
    params.set("direction", options.direction);
  }

  const response = await fetch(`/api/load.php?${params.toString()}`);
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Load failed");
  }

  return result.rows;
}

export async function storeRow(table, data) {
  const response = await fetch("/api/store.php", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ table, data }),
  });

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Store failed");
  }

  return result;
}
