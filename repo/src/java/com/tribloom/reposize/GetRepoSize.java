package com.tribloom.reposize;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.alfresco.service.cmr.repository.ContentService;
import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationConverter;
import org.apache.commons.configuration.MapConfiguration;
import org.apache.log4j.Logger;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class GetRepoSize extends DeclarativeWebScript {

	private static Logger logger = Logger.getLogger(GetRepoSize.class);

	private Properties globalProperties;
	private ContentService contentService;

	public void setGlobalProperties(Properties props) {
		globalProperties = props;
	}
	
	public void setContentService(ContentService service) {
		contentService = service;
	}

	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req,
			Status status, Cache cache) {
		Map<String, Object> model = new HashMap<String, Object>();

		// Use Apache Configuration library to perform variable interpolation if
		// necessary
		MapConfiguration config = (MapConfiguration) ConfigurationConverter
				.getConfiguration(globalProperties);
		Configuration intConfig = config.interpolatedConfiguration();
		
		String contentStore = (String) intConfig.getProperty("dir.contentstore");
		String indexes = (String) intConfig.getProperty("dir.indexes");
		String indexesBackup = (String) intConfig.getProperty("dir.indexes.backup");

		try {
			/**
			 * TODO: Figure if there's a need and a way to perform this size request on multiple
			 * stores, configured with the Content Selector Service
			 * 
			 * Can do nodeService.getStores() to get the StoreRef's, but how
			 * to retrieve contentService for these refs? Or does contentService
			 * intelligently handle this?
			 */
			long storeFreeSpace = contentService.getStoreFreeSpace();
			long storeTotalSpace = contentService.getStoreTotalSpace();
			
			if (logger.isDebugEnabled()) {
				logger.debug(" storeFreeSpace = " + storeFreeSpace);
				logger.debug(" storeTotalSpace = " + storeTotalSpace);
			}
			
			long contentStoreSize = getFileSize(new File(contentStore));
			
			if (logger.isDebugEnabled()) {
				logger.debug(" contentStorePath = " + contentStore);
				logger.debug(" contentStoreSize = " + contentStoreSize);
				if (storeTotalSpace - storeFreeSpace == contentStoreSize) {
					logger.debug(" Size verified!");
				} else {
					logger.debug(" Size not verified: " + storeTotalSpace + " - " + storeFreeSpace + " != " + contentStoreSize);
				}
			}
			
			long indexesSize = getFileSize(new File(indexes));
			long indexesBackupSize = getFileSize(new File(indexesBackup));
			
			if (logger.isDebugEnabled()) {
				logger.debug("  indexes = " + indexes);
				logger.debug("  indexesSize = " + indexesSize);
				logger.debug("  indexesBackup = " + indexesBackup);
				logger.debug("  indexesBackupSize = " + indexesBackupSize);
			}

			model.put("contentStorePath", contentStore);
			model.put("contentStoreSize", contentStoreSize);
			model.put("storeFreeSpace", storeFreeSpace);
			model.put("storeTotalSpace", storeTotalSpace);
			model.put("indexesPath", indexes);
			model.put("indexesSize", indexesSize);
			model.put("indexesBackupPath", indexesBackup);
			model.put("indexesBackupSize", indexesBackupSize);

		} catch (Exception e) {
			status.setCode(Status.STATUS_INTERNAL_SERVER_ERROR);
			status.setException(e);
			status.setMessage(e.getMessage());
			status.setRedirect(false);
		}

		return model;
	}

	/**
	 * This is a recursive method. If file is found, total file size is
	 * calculated. If it is a folder, we recurse further.
	 */
	public long getFileSize(File folder) {

		if (logger.isDebugEnabled()) {
			logger.debug("Processing " + folder.getAbsolutePath());
		}
		long foldersize = 0;

		File[] filelist = folder.listFiles();
		for (int i = 0; i < filelist.length; i++) {
			if (filelist[i].isDirectory()) {
				foldersize += getFileSize(filelist[i]);
			} else {
				foldersize += filelist[i].length();
			}
		}

		return foldersize;
	}
}
