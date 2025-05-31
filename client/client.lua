local function AddApp()
    local dataLoaded = exports[Config.PhoneResourceName]:GetDataLoaded()
    while not dataLoaded do
        Wait(500)
        dataLoaded = exports[Config.PhoneResourceName]:GetDataLoaded()
    end

    exports[Config.PhoneResourceName]:AddCustomApp({
        key = Config.AppKey,
        name = "Los Santos News",
        defaultApp = true,
        ui = "https://cfx-nui-" .. GetCurrentResourceName() .. "/ui/dist/index.html",
        icon = {
            yos = "https://cdn-icons-png.flaticon.com/512/2965/2965879.png",
            humanoid = "https://cdn-icons-png.flaticon.com/512/2965/2965879.png",
        },
    })
end

RegisterNUICallback('getUserData', function(_, cb)
    local Player = QBCore and QBCore.Functions.GetPlayerData() or ESX and ESX.GetPlayerData()
    local isReporter = Player.job.name == Config.JobName
    
    cb({
        isReporter = isReporter,
        playerName = Player.charinfo and Player.charinfo.firstname .. " " .. Player.charinfo.lastname or Player.name,
        jobGrade = Player.job.grade
    })
end)

AddEventHandler("onResourceStop", function(resource)
    if resource == GetCurrentResourceName() then
        exports[Config.PhoneResourceName]:RemoveCustomApp(Config.AppKey)
    end
end)

AddEventHandler("onResourceStart", function(resource)
    if resource == Config.PhoneResourceName then
        while GetResourceState(Config.PhoneResourceName) ~= "started" do Wait(500) end
        AddApp()
    end
end)

CreateThread(function()
    while GetResourceState(Config.PhoneResourceName) ~= "started" do Wait(500) end
    AddApp()
end)