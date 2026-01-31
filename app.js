const storageKey = "it-docs-data";

const emptyState = {
  customers: [],
  sites: [],
  roles: [],
  technicians: [],
  switches: [],
  devices: [],
  portLinks: [],
  credentials: [],
  segments: [],
  software: [],
};

const state = loadData();

const selectors = {
  navItems: document.querySelectorAll(".nav-item"),
  pages: document.querySelectorAll(".page"),
  search: document.getElementById("global-search"),
  stats: {
    customers: document.getElementById("stat-customers"),
    sites: document.getElementById("stat-sites"),
    devices: document.getElementById("stat-devices"),
    ports: document.getElementById("stat-ports"),
  },
  customerForm: document.getElementById("customer-form"),
  customerTable: document.getElementById("customer-table"),
  siteForm: document.getElementById("site-form"),
  siteTable: document.getElementById("site-table"),
  roleForm: document.getElementById("role-form"),
  roleTable: document.getElementById("role-table"),
  technicianForm: document.getElementById("technician-form"),
  technicianTable: document.getElementById("technician-table"),
  switchForm: document.getElementById("switch-form"),
  switchTable: document.getElementById("switch-table"),
  deviceForm: document.getElementById("device-form"),
  deviceTable: document.getElementById("device-table"),
  portLinkForm: document.getElementById("port-link-form"),
  portLinkTable: document.getElementById("port-link-table"),
  credentialForm: document.getElementById("credential-form"),
  credentialTable: document.getElementById("credential-table"),
  segmentForm: document.getElementById("segment-form"),
  segmentTable: document.getElementById("segment-table"),
  softwareForm: document.getElementById("software-form"),
  softwareTable: document.getElementById("software-table"),
  selects: {
    customerForSite: document.querySelector("#site-form select[name='customer']"),
    customerForDevice: document.querySelector("#device-form select[name='customer']"),
    customerForSegment: document.querySelector("#segment-form select[name='customer']"),
    customerForTechnician: document.querySelector("#technician-form select[name='customer']"),
    siteForSwitch: document.querySelector("#switch-form select[name='site']"),
    siteForDevice: document.querySelector("#device-form select[name='site']"),
    switchForPort: document.querySelector("#port-link-form select[name='switch']"),
    deviceForPort: document.querySelector("#port-link-form select[name='device']"),
    deviceForCredential: document.querySelector("#credential-form select[name='device']"),
    deviceForSoftware: document.querySelector("#software-form select[name='device']"),
    roleForTechnician: document.querySelector("#technician-form select[name='role']"),
  },
};

function loadData() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    return structuredClone(emptyState);
  }
  try {
    return { ...structuredClone(emptyState), ...JSON.parse(stored) };
  } catch (error) {
    console.warn("Daten konnten nicht geladen werden.", error);
    return structuredClone(emptyState);
  }
}

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function resetForm(form) {
  form.reset();
}

function updateSelectOptions(select, items, labelFn) {
  select.innerHTML = "";
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = labelFn(item);
    select.append(option);
  });
}

function setActivePage(pageId) {
  selectors.pages.forEach((page) => page.classList.toggle("active", page.id === pageId));
  selectors.navItems.forEach((item) =>
    item.classList.toggle("active", item.dataset.page === pageId),
  );
}

function renderStats() {
  selectors.stats.customers.textContent = state.customers.length;
  selectors.stats.sites.textContent = state.sites.length;
  selectors.stats.devices.textContent = state.devices.length;
  selectors.stats.ports.textContent = state.portLinks.length;
}

function findPortLink(deviceId) {
  return state.portLinks.find((link) => link.deviceId === deviceId);
}

function renderCustomers() {
  selectors.customerTable.innerHTML = state.customers
    .map(
      (customer) => `
        <tr>
          <td>${customer.name}</td>
          <td>${customer.contact || "-"}</td>
          <td>${customer.note || "-"}</td>
          <td>${customer.contract || "-"}</td>
        </tr>
      `,
    )
    .join("");

  updateSelectOptions(selectors.selects.customerForSite, state.customers, (customer) => customer.name);
  updateSelectOptions(selectors.selects.customerForDevice, state.customers, (customer) => customer.name);
  updateSelectOptions(
    selectors.selects.customerForSegment,
    state.customers,
    (customer) => customer.name,
  );
  updateSelectOptions(
    selectors.selects.customerForTechnician,
    state.customers,
    (customer) => customer.name,
  );
}

function renderSites() {
  selectors.siteTable.innerHTML = state.sites
    .map((site) => {
      const customer = state.customers.find((item) => item.id === site.customerId);
      return `
        <tr>
          <td>${site.name}</td>
          <td>${site.address}</td>
          <td>${customer ? customer.name : "-"}</td>
          <td>${site.contact || "-"}</td>
        </tr>
      `;
    })
    .join("");

  updateSelectOptions(selectors.selects.siteForSwitch, state.sites, (site) => site.name);
  updateSelectOptions(selectors.selects.siteForDevice, state.sites, (site) => site.name);
}

function renderRoles() {
  selectors.roleTable.innerHTML = state.roles
    .map(
      (role) => `
        <tr>
          <td>${role.name}</td>
          <td>${role.permissions || "-"}</td>
        </tr>
      `,
    )
    .join("");

  updateSelectOptions(selectors.selects.roleForTechnician, state.roles, (role) => role.name);
}

function renderTechnicians() {
  selectors.technicianTable.innerHTML = state.technicians
    .map((tech) => {
      const role = state.roles.find((item) => item.id === tech.roleId);
      const customer = state.customers.find((item) => item.id === tech.customerId);
      return `
        <tr>
          <td>${tech.name}</td>
          <td>${tech.email}</td>
          <td>${role ? role.name : "-"}</td>
          <td>${customer ? customer.name : "-"}</td>
        </tr>
      `;
    })
    .join("");
}

function renderSwitches() {
  selectors.switchTable.innerHTML = state.switches
    .map((networkSwitch) => {
      const site = state.sites.find((item) => item.id === networkSwitch.siteId);
      return `
        <tr>
          <td>${networkSwitch.name}</td>
          <td>${site ? site.name : "-"}</td>
          <td>${networkSwitch.ports}</td>
          <td>${networkSwitch.ip || "-"}</td>
        </tr>
      `;
    })
    .join("");

  updateSelectOptions(
    selectors.selects.switchForPort,
    state.switches,
    (sw) => `${sw.name} (${sw.siteName || sw.siteId || "-"})`,
  );
}

function renderDevices(filter = "") {
  const query = filter.toLowerCase();
  selectors.deviceTable.innerHTML = state.devices
    .filter((device) => {
      if (!query) {
        return true;
      }
      const haystack = `${device.name} ${device.type} ${device.ip || ""}`.toLowerCase();
      return haystack.includes(query);
    })
    .map((device) => {
      const customer = state.customers.find((item) => item.id === device.customerId);
      const site = state.sites.find((item) => item.id === device.siteId);
      const portLink = findPortLink(device.id);
      const switchInfo = portLink
        ? state.switches.find((item) => item.id === portLink.switchId)
        : null;
      const portLabel = portLink && switchInfo ? `${switchInfo.name} · ${portLink.port}` : "-";
      return `
        <tr>
          <td>${device.name}</td>
          <td>${device.type}</td>
          <td>${customer ? customer.name : "-"}</td>
          <td>${site ? site.name : "-"}</td>
          <td>${device.ip || "-"}</td>
          <td>${portLabel}</td>
        </tr>
      `;
    })
    .join("");

  updateSelectOptions(selectors.selects.deviceForPort, state.devices, (device) => device.name);
  updateSelectOptions(
    selectors.selects.deviceForCredential,
    state.devices,
    (device) => device.name,
  );
  updateSelectOptions(selectors.selects.deviceForSoftware, state.devices, (device) => device.name);
}

function renderPortLinks() {
  selectors.portLinkTable.innerHTML = state.portLinks
    .map((link) => {
      const networkSwitch = state.switches.find((item) => item.id === link.switchId);
      const device = state.devices.find((item) => item.id === link.deviceId);
      return `
        <tr>
          <td>${networkSwitch ? networkSwitch.name : "-"}</td>
          <td>${link.port}</td>
          <td>${link.vlan || "-"}</td>
          <td>${device ? device.name : "-"}</td>
        </tr>
      `;
    })
    .join("");
}

function renderCredentials() {
  selectors.credentialTable.innerHTML = state.credentials
    .map((credential) => {
      const device = state.devices.find((item) => item.id === credential.deviceId);
      return `
        <tr>
          <td>${device ? device.name : "-"}</td>
          <td>${credential.username}</td>
          <td>${credential.password}</td>
          <td>${credential.rotation || "-"}</td>
          <td>${credential.notes || "-"}</td>
        </tr>
      `;
    })
    .join("");
}

function renderSegments() {
  selectors.segmentTable.innerHTML = state.segments
    .map((segment) => {
      const customer = state.customers.find((item) => item.id === segment.customerId);
      return `
        <tr>
          <td>${segment.name}</td>
          <td>${segment.range}</td>
          <td>${customer ? customer.name : "-"}</td>
          <td>${segment.purpose || "-"}</td>
        </tr>
      `;
    })
    .join("");
}

function renderSoftware() {
  selectors.softwareTable.innerHTML = state.software
    .map((entry) => {
      const device = state.devices.find((item) => item.id === entry.deviceId);
      return `
        <tr>
          <td>${entry.name}</td>
          <td>${entry.version || "-"}</td>
          <td>${device ? device.name : "-"}</td>
          <td>${entry.license || "-"}</td>
          <td>${entry.expires || "-"}</td>
        </tr>
      `;
    })
    .join("");
}

function renderAll() {
  renderStats();
  renderCustomers();
  renderSites();
  renderRoles();
  renderTechnicians();
  renderSwitches();
  renderDevices();
  renderPortLinks();
  renderCredentials();
  renderSegments();
  renderSoftware();
}

selectors.navItems.forEach((item) => {
  item.addEventListener("click", () => setActivePage(item.dataset.page));
});

selectors.search.addEventListener("input", (event) => {
  renderDevices(event.target.value.trim());
});

selectors.customerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  state.customers.push({
    id: createId("customer"),
    name: formData.get("name").trim(),
    contact: formData.get("contact").trim(),
    note: formData.get("note").trim(),
    contract: formData.get("contract").trim(),
  });
  saveData();
  renderCustomers();
  renderStats();
  resetForm(event.target);
});

selectors.siteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  state.sites.push({
    id: createId("site"),
    name: formData.get("name").trim(),
    address: formData.get("address").trim(),
    customerId: formData.get("customer"),
    contact: formData.get("contact").trim(),
  });
  saveData();
  renderSites();
  renderStats();
  resetForm(event.target);
});

selectors.roleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  state.roles.push({
    id: createId("role"),
    name: formData.get("name").trim(),
    permissions: formData.get("permissions").trim(),
  });
  saveData();
  renderRoles();
  resetForm(event.target);
});

selectors.technicianForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  state.technicians.push({
    id: createId("tech"),
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    roleId: formData.get("role"),
    customerId: formData.get("customer"),
  });
  saveData();
  renderTechnicians();
  resetForm(event.target);
});

selectors.switchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const siteId = formData.get("site");
  const site = state.sites.find((item) => item.id === siteId);
  state.switches.push({
    id: createId("switch"),
    name: formData.get("name").trim(),
    siteId,
    siteName: site ? site.name : "-",
    ports: Number(formData.get("ports")),
    ip: formData.get("ip").trim(),
  });
  saveData();
  renderSwitches();
  resetForm(event.target);
});

selectors.deviceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  state.devices.push({
    id: createId("device"),
    name: formData.get("name").trim(),
    type: formData.get("type").trim(),
    customerId: formData.get("customer"),
    siteId: formData.get("site"),
    ip: formData.get("ip").trim(),
    serial: formData.get("serial").trim(),
    notes: formData.get("notes").trim(),
  });
  saveData();
  renderDevices(selectors.search.value.trim());
  renderStats();
  resetForm(event.target);
});

selectors.portLinkForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const switchId = formData.get("switch");
  const port = formData.get("port").trim();
  const vlan = formData.get("vlan").trim();
  const deviceId = formData.get("device");

  const existing = state.portLinks.find(
    (link) => link.switchId === switchId && link.port.toLowerCase() === port.toLowerCase(),
  );

  if (existing) {
    alert("Dieser Switchport ist bereits belegt.");
    return;
  }

  const existingDeviceLink = state.portLinks.find((link) => link.deviceId === deviceId);
  if (existingDeviceLink) {
    existingDeviceLink.switchId = switchId;
    existingDeviceLink.port = port;
    existingDeviceLink.vlan = vlan;
  } else {
    state.portLinks.push({
      id: createId("link"),
      switchId,
      port,
      vlan,
      deviceId,
    });
  }

  saveData();
  renderPortLinks();
  renderDevices(selectors.search.value.trim());
  renderStats();
  resetForm(event.target);
});

selectors.segmentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  state.segments.push({
    id: createId("segment"),
    name: formData.get("name").trim(),
    range: formData.get("range").trim(),
    customerId: formData.get("customer"),
    purpose: formData.get("purpose").trim(),
  });
  saveData();
  renderSegments();
  resetForm(event.target);
});

selectors.softwareForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  state.software.push({
    id: createId("software"),
    name: formData.get("name").trim(),
    version: formData.get("version").trim(),
    deviceId: formData.get("device"),
    license: formData.get("license").trim(),
    expires: formData.get("expires"),
  });
  saveData();
  renderSoftware();
  resetForm(event.target);
});

selectors.credentialForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  state.credentials.push({
    id: createId("cred"),
    deviceId: formData.get("device"),
    username: formData.get("username").trim(),
    password: formData.get("password").trim(),
    rotation: formData.get("rotation"),
    notes: formData.get("notes").trim(),
  });
  saveData();
  renderCredentials();
  resetForm(event.target);
});

renderAll();
