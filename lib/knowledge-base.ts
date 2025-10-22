import { getRAGPipeline, type DocumentInput } from "./rag-pipeline"

// Sample FiveM documentation for initial knowledge base
const fivemKnowledgeBase: DocumentInput[] = [
  {
    content: `GetPlayerPed(playerId) -> Ped

Returns the ped handle for the specified player.

Parameters:
- playerId: The player ID (integer)

Returns:
- Ped: The ped handle (integer)

Example:
local playerPed = GetPlayerPed(PlayerId())
local coords = GetEntityCoords(playerPed)`,
    metadata: {
      source: "fivem-natives",
      framework: "fivem",
      type: "native",
      title: "GetPlayerPed",
      category: "player",
    },
  },
  {
    content: `RegisterNetEvent(eventName, eventHandler)

Registers a network event handler that can receive data from server or client.

Parameters:
- eventName: The name of the event (string)
- eventHandler: The function to call when event is triggered

Security Note: Always validate the source and data parameters for security.

Example:
RegisterNetEvent('myresource:client:notify', function(message)
    print('Received message:', message)
end)`,
    metadata: {
      source: "fivem-docs",
      framework: "fivem",
      type: "function",
      title: "RegisterNetEvent",
      category: "events",
    },
  },
  {
    content: `Wait(ms)

Pauses script execution for the specified number of milliseconds.

Parameters:
- ms: Milliseconds to wait (integer)

Performance Notes:
- Use Wait(0) sparingly as it can impact performance
- Prefer higher values like Wait(100) or Wait(1000) in loops
- Always include Wait() in while loops to prevent server freezing

Example:
CreateThread(function()
    while true do
        Wait(1000) -- Wait 1 second
        -- Your code here
    end
end)`,
    metadata: {
      source: "fivem-performance",
      framework: "fivem",
      type: "function",
      title: "Wait",
      category: "performance",
    },
  },
  {
    content: `QBCore.Functions.GetPlayer(source) -> Player

Retrieves player data from the server using the player's server ID.

Parameters:
- source: Player server ID (integer)

Returns:
- Player: Player object containing all player information including job, money, items, etc.
- nil: If player not found

Example:
local Player = QBCore.Functions.GetPlayer(source)
if not Player then return end

local playerName = Player.PlayerData.name
local playerJob = Player.PlayerData.job.name`,
    metadata: {
      source: "qbcore-docs",
      framework: "qbcore",
      type: "function",
      title: "QBCore.Functions.GetPlayer",
      category: "player",
    },
  },
  {
    content: `QBCore.Commands.Add(name, help, arguments, argsrequired, callback, permission)

Adds a new command to the QBCore command system.

Parameters:
- name: Command name (string)
- help: Help text (string)
- arguments: Array of argument definitions
- argsrequired: Whether arguments are required (boolean)
- callback: Function to execute (function)
- permission: Required permission level (string)

Example:
QBCore.Commands.Add('heal', 'Heal yourself', {}, false, function(source, args)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then return end
    
    TriggerClientEvent('hospital:client:Revive', source)
end, 'admin')`,
    metadata: {
      source: "qbcore-docs",
      framework: "qbcore",
      type: "function",
      title: "QBCore.Commands.Add",
      category: "commands",
    },
  },
  {
    content: `ESX.GetPlayerFromId(playerId) -> xPlayer

Gets the ESX player object from server ID.

Parameters:
- playerId: Player server ID (integer)

Returns:
- xPlayer: ESX player object with ESX-specific methods and properties
- nil: If player not found

Example:
local xPlayer = ESX.GetPlayerFromId(source)
if not xPlayer then return end

local playerName = xPlayer.getName()
local playerJob = xPlayer.getJob().name
local playerMoney = xPlayer.getMoney()`,
    metadata: {
      source: "esx-docs",
      framework: "esx",
      type: "function",
      title: "ESX.GetPlayerFromId",
      category: "player",
    },
  },
  {
    content: `exports['qb-target']:AddBoxZone(name, center, length, width, options, targetoptions)

Creates an interaction zone using qb-target.

Parameters:
- name: Unique zone name (string)
- center: Zone center coordinates (vector3)
- length: Zone length (number)
- width: Zone width (number)
- options: Zone configuration options
- targetoptions: Target interaction options

Example:
exports['qb-target']:AddBoxZone("shop_zone", vector3(25.0, -1347.0, 29.5), 2.0, 2.0, {
    name = "shop_zone",
    heading = 0.0,
    debugPoly = false,
    minZ = 28.5,
    maxZ = 30.5,
}, {
    options = {
        {
            type = "client",
            event = "shop:client:open",
            icon = "fas fa-shopping-cart",
            label = "Open Shop",
        },
    },
    distance = 2.5
})`,
    metadata: {
      source: "qb-target-docs",
      framework: "qbcore",
      type: "export",
      title: "qb-target AddBoxZone",
      category: "interaction",
    },
  },
]

export async function initializeKnowledgeBase(): Promise<void> {
  const ragPipeline = getRAGPipeline()

  try {
    console.log("Initializing knowledge base...")

    // Clear existing data
    await ragPipeline.clear()

    // Ingest sample documentation
    const result = await ragPipeline.ingestDocuments(fivemKnowledgeBase, {
      chunkSize: 800,
      chunkOverlap: 100,
      batchSize: 5,
    })

    console.log("Knowledge base initialized:", result)
  } catch (error) {
    console.error("Failed to initialize knowledge base:", error)
  }
}

export async function addUserDocuments(documents: DocumentInput[]): Promise<{
  processedDocuments: number
  totalChunks: number
  failedDocuments: number
}> {
  const ragPipeline = getRAGPipeline()

  return await ragPipeline.ingestDocuments(documents, {
    chunkSize: 1000,
    chunkOverlap: 200,
    batchSize: 10,
  })
}
