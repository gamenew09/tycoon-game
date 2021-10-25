local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local t = TS.import(script, TS.getModule(script, "@rbxts", "t").lib.ts).t

---

-- RIP gonna have to update this every roblox update yikes.
local InstanceNames = {
    "AnimationTrack",
	"BaseWrap",
	"CatalogPages",
	"CommandInstance",
	"CustomDspSoundEffect",
	"DataModel",
	"DataStore",
	"DataStoreInfo",
	"DataStoreKey",
	"DataStoreKeyInfo",
	"DataStoreKeyPages",
	"DataStoreListingPages",
	"DataStoreObjectVersionInfo",
	"DataStorePages",
	"DataStoreVersionPages",
	"DebuggerConnection",
	"DebuggerVariable",
	"EmotesPages",
	"FriendPages",
	"GlobalDataStore",
	"ImporterBaseSettings",
	"ImporterGroupSettings",
	"ImporterJointSettings",
	"ImporterMeshSettings",
	"ImporterRootSettings",
	"ImporterTextureSettings",
	"InputObject",
	"InstanceAdornment",
	"InventoryPages",
	"MemoryStoreQueue",
	"MemoryStoreSortedMap",
	"MessageBusConnection",
	"Mouse",
	"NetworkMarker",
	"OrderedDataStore",
	"OutfitPages",
	"PackageLink",
	"ParabolaAdornment",
	"Path",
	"PausedState",
	"PausedStateBreakpoint",
	"PausedStateException",
	"Platform",
	"Player",
	"PlayerGui",
	"PlayerMouse",
	"PlayerScripts",
	"PluginManagerInterface",
	"PoseBase",
	"ScriptRef",
	"ScriptRefId",
	"ScriptRefPath",
	"StackFrame",
	"StandardPages",
	"StarterCharacterScripts",
	"StarterPlayerScripts",
	"TeleportAsyncResult",
	"Terrain",
	"TextFilterResult",
	"ThreadState",
	"TouchTransmitter",
	"Translator",
	"Tween",
	"UserGameSettings",
	"UserSettings",
	"VoiceSource",
    "AnalyticsService",
	"AppUpdateService",
	"AssetCounterService",
	"AssetDeliveryProxy",
	"AssetImportService",
	"AssetManagerService",
	"AssetService",
	"AvatarEditorService",
	"AvatarImportService",
	"BadgeService",
	"BulkImportService",
	"CalloutService",
	"Chat",
	"CollectionService",
	"CommandService",
	"ContentProvider",
	"ContextActionService",
	"ControllerService",
	"DataStoreService",
	"Debris",
	"DebuggerConnectionManager",
	"DraggerService",
	"EventIngestService",
	"GamePassService",
	"GroupService",
	"GuiService",
	"HapticService",
	"HeightmapImporterService",
	"HttpService",
	"ILegacyStudioBridge",
	"IncrementalPatchBuilder",
	"InsertService",
	"InternalContainer",
	"IXPService",
	"JointsService",
	"KeyframeSequenceProvider",
	"LanguageService",
	"LegacyStudioBridge",
	"Lighting",
	"LocalizationService",
	"LogService",
	"MarketplaceService",
	"MaterialService",
	"MemoryStoreService",
	"MessageBusService",
	"MessagingService",
	"PathfindingService",
	"PhysicsService",
	"Players",
	"PluginPolicyService",
	"PolicyService",
	"ProximityPromptService",
	"PublishService",
	"RemoteDebuggerServer",
	"ReplicatedFirst",
	"ReplicatedScriptService",
	"ReplicatedStorage",
	"RunService",
	"ScriptContext",
	"ServerScriptService",
	"ServerStorage",
	"SessionService",
	"SocialService",
	"SoundService",
	"StarterGui",
	"StarterPack",
	"StarterPlayer",
	"Stats",
	"StudioDeviceEmulatorService",
	"Teams",
	"TeleportService",
	"TextService",
	"ToastNotificationService",
	"TracerService",
	"TweenService",
	"UnvalidatedAssetService",
	"UserInputService",
	"UserService",
	"VoiceChatService",
	"VRService",
	"Workspace",
    "Accessory",
	"Accoutrement",
	"Actor",
	"AlignOrientation",
	"AlignPosition",
	"AngularVelocity",
	"Animation",
	"AnimationController",
	"AnimationRigData",
	"Animator",
	"ArcHandles",
	"Atmosphere",
	"Attachment",
	"Backpack",
	"BallSocketConstraint",
	"Beam",
	"BillboardGui",
	"BinaryStringValue",
	"BindableEvent",
	"BindableFunction",
	"BlockMesh",
	"BloomEffect",
	"BlurEffect",
	"BodyAngularVelocity",
	"BodyColors",
	"BodyForce",
	"BodyGyro",
	"BodyPosition",
	"BodyThrust",
	"BodyVelocity",
	"Bone",
	"BoolValue",
	"BoxHandleAdornment",
	"Breakpoint",
	"BrickColorValue",
	"Camera",
	"CanvasGroup",
	"CFrameValue",
	"ChannelSelectorSoundEffect",
	"CharacterMesh",
	"ChorusSoundEffect",
	"ClickDetector",
	"Clouds",
	"Color3Value",
	"ColorCorrectionEffect",
	"CompressorSoundEffect",
	"ConeHandleAdornment",
	"Configuration",
	"CornerWedgePart",
	"CylinderHandleAdornment",
	"CylinderMesh",
	"CylindricalConstraint",
	"DataStoreIncrementOptions",
	"DataStoreOptions",
	"DataStoreSetOptions",
	"Decal",
	"DepthOfFieldEffect",
	"Dialog",
	"DialogChoice",
	"DistortionSoundEffect",
	"DoubleConstrainedValue",
	"Dragger",
	"EchoSoundEffect",
	"EqualizerSoundEffect",
	"Explosion",
	"FaceControls",
	"FileMesh",
	"Fire",
	"FlangeSoundEffect",
	"FloorWire",
	"Folder",
	"ForceField",
	"Frame",
	"Glue",
	"Handles",
	"Hat",
	"HingeConstraint",
	"Hole",
	"Humanoid",
	"HumanoidController",
	"HumanoidDescription",
	"ImageButton",
	"ImageHandleAdornment",
	"ImageLabel",
	"IntConstrainedValue",
	"IntValue",
	"Keyframe",
	"KeyframeMarker",
	"KeyframeSequence",
	"LinearVelocity",
	"LineForce",
	"LineHandleAdornment",
	"LocalizationTable",
	"LocalScript",
	"ManualGlue",
	"ManualWeld",
	"MaterialVariant",
	"MeshPart",
	"Model",
	"ModuleScript",
	"Motor",
	"Motor6D",
	"MotorFeature",
	"NegateOperation",
	"NoCollisionConstraint",
	"NumberPose",
	"NumberValue",
	"ObjectValue",
	"Pants",
	"Part",
	"ParticleEmitter",
	"PartOperation",
	"PathfindingModifier",
	"PitchShiftSoundEffect",
	"PointLight",
	"Pose",
	"PrismaticConstraint",
	"ProximityPrompt",
	"RayValue",
	"RemoteEvent",
	"RemoteFunction",
	"ReverbSoundEffect",
	"RocketPropulsion",
	"RodConstraint",
	"RopeConstraint",
	"Rotate",
	"RotateP",
	"RotateV",
	"ScreenGui",
	"Script",
	"ScrollingFrame",
	"Seat",
	"SelectionBox",
	"SelectionPartLasso",
	"SelectionPointLasso",
	"SelectionSphere",
	"Shirt",
	"ShirtGraphic",
	"SkateboardController",
	"SkateboardPlatform",
	"Sky",
	"Smoke",
	"Snap",
	"Sound",
	"SoundGroup",
	"Sparkles",
	"SpawnLocation",
	"Speaker",
	"SpecialMesh",
	"SphereHandleAdornment",
	"SpotLight",
	"SpringConstraint",
	"StarterGear",
	"StringValue",
	"SunRaysEffect",
	"SurfaceAppearance",
	"SurfaceGui",
	"SurfaceLight",
	"SurfaceSelection",
	"Team",
	"TeleportOptions",
	"TerrainRegion",
	"TextBox",
	"TextButton",
	"TextLabel",
	"Texture",
	"Tool",
	"Torque",
	"TorsionSpringConstraint",
	"Trail",
	"TremoloSoundEffect",
	"TrussPart",
	"UIAspectRatioConstraint",
	"UICorner",
	"UIGradient",
	"UIGridLayout",
	"UIListLayout",
	"UIPadding",
	"UIPageLayout",
	"UIScale",
	"UISizeConstraint",
	"UIStroke",
	"UITableLayout",
	"UITextSizeConstraint",
	"UnionOperation",
	"UniversalConstraint",
	"Vector3Value",
	"VectorForce",
	"VehicleController",
	"VehicleSeat",
	"VelocityMotor",
	"VideoFrame",
	"ViewportFrame",
	"WedgePart",
	"Weld",
	"WeldConstraint",
	"WorldModel",
	"WrapLayer",
	"WrapTarget",
    "BackpackItem",
	"BasePart",
	"BasePlayerGui",
	"BaseScript",
	"BevelMesh",
	"BodyMover",
	"CharacterAppearance",
	"Clothing",
	"Constraint",
	"Controller",
	"DataModelMesh",
	"DynamicRotate",
	"FaceInstance",
	"Feature",
	"FormFactorPart",
	"GenericSettings",
	"GuiBase",
	"GuiBase2d",
	"GuiBase3d",
	"GuiButton",
	"GuiLabel",
	"GuiObject",
	"HandleAdornment",
	"HandlesBase",
	"Instance",
	"JointInstance",
	"LayerCollector",
	"Light",
	"LuaSourceContainer",
	"ManualSurfaceJointInstance",
	"Pages",
	"PartAdornment",
	"PostEffect",
	"PVAdornment",
	"PVInstance",
	"SelectionLasso",
	"ServiceProvider",
	"SlidingBallConstraint",
	"SoundEffect",
	"TriangleMeshPart",
	"TweenBase",
	"UIBase",
	"UIComponent",
	"UIConstraint",
	"UIGridStyleLayout",
	"UILayout",
	"ValueBase",
	"WorldRoot"
}

local module = {}

module.InstanceIsA = {}
module.InstanceOf = {}

for _, instanceClassName in pairs(InstanceNames) do
    module.InstanceIsA[instanceClassName] = t.instanceIsA(instanceClassName)
    module.InstanceOf[instanceClassName] = t.instanceOf(instanceClassName)
end

return module