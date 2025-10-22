import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const snippetsRequestSchema = z.object({
  category: z
    .enum(["fxmanifest", "events", "commands", "callbacks", "exports", "qb-target", "polyzone", "ox_lib"])
    .optional(),
  framework: z.enum(["qbcore", "esx", "standalone"]).optional(),
  search: z.string().optional(),
})

interface CodeSnippet {
  id: string
  title: string
  description: string
  category: string
  framework: string
  code: string
  tags: string[]
}

const snippets: CodeSnippet[] = [
  {
    id: "fxmanifest-qb",
    title: "QBCore FXManifest",
    description: "Basic fxmanifest.lua for QBCore resources",
    category: "fxmanifest",
    framework: "qbcore",
    code: `fx_version 'cerulean'
game 'gta5'

author 'YourName'
description 'QBCore Resource'
version '1.0.0'

shared_scripts {
    '@qb-core/shared/locale.lua',
    'locales/en.lua',
    'config.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua'
}

lua54 'yes'`,
    tags: ["manifest", "qbcore", "basic"],
  },
  {
    id: "fxmanifest-esx",
    title: "ESX FXManifest",
    description: "Basic fxmanifest.lua for ESX resources",
    category: "fxmanifest",
    framework: "esx",
    code: `fx_version 'cerulean'
game 'gta5'

author 'YourName'
description 'ESX Resource'
version '1.0.0'

shared_scripts {
    '@es_extended/imports.lua',
    'config.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua'
}

dependencies {
    'es_extended'
}

lua54 'yes'`,
    tags: ["manifest", "esx", "basic"],
  },
  {
    id: "qb-server-event",
    title: "QBCore Server Event",
    description: "Server-side event handler with player validation",
    category: "events",
    framework: "qbcore",
    code: `local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent('your-resource:server:eventName', function(data)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    
    if not Player then return end
    
    -- Validate data
    if not data or type(data) ~= 'table' then
        return
    end
    
    -- Your server logic here
    print('Event triggered by:', Player.PlayerData.name)
    
    -- Send response back to client
    TriggerClientEvent('your-resource:client:response', src, {
        success = true,
        message = 'Event processed successfully'
    })
end)`,
    tags: ["event", "server", "qbcore", "validation"],
  },
  {
    id: "esx-server-event",
    title: "ESX Server Event",
    description: "Server-side event handler with player validation",
    category: "events",
    framework: "esx",
    code: `RegisterNetEvent('your-resource:server:eventName', function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    
    if not xPlayer then return end
    
    -- Validate data
    if not data or type(data) ~= 'table' then
        return
    end
    
    -- Your server logic here
    print('Event triggered by:', xPlayer.getName())
    
    -- Send response back to client
    TriggerClientEvent('your-resource:client:response', src, {
        success = true,
        message = 'Event processed successfully'
    })
end)`,
    tags: ["event", "server", "esx", "validation"],
  },
  {
    id: "qb-command",
    title: "QBCore Command",
    description: "Command with permission checking",
    category: "commands",
    framework: "qbcore",
    code: `local QBCore = exports['qb-core']:GetCoreObject()

QBCore.Commands.Add('yourcommand', 'Command description', {
    {name = 'argument', help = 'Argument description'}
}, false, function(source, args)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    
    if not Player then return end
    
    -- Command logic here
    local argument = args[1]
    
    if not argument then
        TriggerClientEvent('QBCore:Notify', src, 'Missing argument', 'error')
        return
    end
    
    TriggerClientEvent('QBCore:Notify', src, 'Command executed successfully', 'success')
end, 'admin') -- Permission level`,
    tags: ["command", "qbcore", "permissions"],
  },
  {
    id: "qb-target-zone",
    title: "QB-Target Zone",
    description: "Create an interaction zone with qb-target",
    category: "qb-target",
    framework: "qbcore",
    code: `exports['qb-target']:AddBoxZone("unique_zone_name", vector3(x, y, z), 2.0, 2.0, {
    name = "unique_zone_name",
    heading = 0.0,
    debugPoly = false,
    minZ = z - 1.0,
    maxZ = z + 1.0,
}, {
    options = {
        {
            type = "client",
            event = "your-resource:client:interact",
            icon = "fas fa-hand",
            label = "Interact",
            canInteract = function()
                -- Add conditions here
                return true
            end,
        },
    },
    distance = 2.5
})`,
    tags: ["qb-target", "interaction", "zone"],
  },
  {
    id: "ox-lib-menu",
    title: "OX Lib Context Menu",
    description: "Create a context menu using ox_lib",
    category: "ox_lib",
    framework: "qbcore",
    code: `local lib = exports.ox_lib

lib:registerContext({
    id = 'example_menu',
    title = 'Example Menu',
    options = {
        {
            title = 'Option 1',
            description = 'Description for option 1',
            icon = 'fa-solid fa-user',
            onSelect = function()
                -- Action for option 1
                print('Option 1 selected')
            end,
        },
        {
            title = 'Option 2',
            description = 'Description for option 2',
            icon = 'fa-solid fa-gear',
            onSelect = function()
                -- Action for option 2
                print('Option 2 selected')
            end,
        },
    }
})

-- Show the menu
lib:showContext('example_menu')`,
    tags: ["ox_lib", "menu", "context", "ui"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const framework = searchParams.get("framework")
    const search = searchParams.get("search")

    let filteredSnippets = snippets

    if (category) {
      filteredSnippets = filteredSnippets.filter((s) => s.category === category)
    }

    if (framework) {
      filteredSnippets = filteredSnippets.filter((s) => s.framework === framework || s.framework === "standalone")
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredSnippets = filteredSnippets.filter(
        (s) =>
          s.title.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower) ||
          s.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    return NextResponse.json({
      snippets: filteredSnippets,
      total: filteredSnippets.length,
      categories: [...new Set(snippets.map((s) => s.category))],
      frameworks: [...new Set(snippets.map((s) => s.framework))],
    })
  } catch (error) {
    console.error("Snippets API error:", error)
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 })
  }
}
